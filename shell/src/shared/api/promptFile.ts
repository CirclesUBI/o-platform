import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { StateSchema } from "xstate";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { uploadFile } from "./uploadFile";
import {
  normalizePromptField,
  prompt,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import EditorView from "@o-platform/o-editors/src/shared/EditorView.svelte";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import PicturePreview from "@o-platform/o-editors/src/PicturePreview.svelte";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import { Generate } from "@o-platform/o-utils/dist/generate";
import { StateNodeConfig } from "xstate/lib/types";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import {Environment} from "../environment";

type UploadPictureSpec<TContext extends ProcessContext<any>> = {
  id?: string;
  field: PromptField<TContext>;
  onlyWhenDirty?: boolean;
  uploaded?: (
    context: TContext,
    event: {
      data: {
        url: string;
        mimeType: string;
        fileName: string;
      };
    }
  ) => void;
  params?: {
    view: EditorViewContext;
    cropShape?: string;
  };
  navigation: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
    next: string;
    skip?: string;
    canSkip?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
  };
};

export function promptFile<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: UploadPictureSpec<TContext>) {
  // This variable will be used to back the 'file' value which
  // usually would be on context.data.file but the
  // PromptField's behaviour is overridden so that it uses
  // this field instead (see 'editFile'.'field' for details).
  let file: {
    mimeType: string;
    fileName: string;
    bytes: Buffer;
  };

  const field = normalizePromptField(spec.field);
  spec.id = spec.id ? spec.id : field.name;
  const generatedId = Generate.randomHexString(4);
  const id = (x: string) => x; // `${spec.id}/${generatedId}/${x}`;

  const editDataFieldConfig: StateNodeConfig<TContext, StateSchema, TEvent> = {
    id: spec.id,
    initial: "checkPreviewFile",
    states: {
      checkPreviewFile: {
        id: id("checkPreviewFile"),
        entry: () => console.log(`checkPreviewFile entry`),
        always: [
          {
            cond: (context) => {
              return !!context.data[field.name];
            },
            target: `#${id("previewFile")}`,
          },
          {
            target: `#${id("checkEditFile")}`,
          },
        ],
      },
      previewFile: prompt<TContext, any>({
        id: id("previewFile"),
        entry: () => console.log(`previewFile entry`),
        field: spec.field,
        component: PicturePreview,
        params: {
          view: spec.params.view,
          submitButtonText: spec.params.view.submitButtonText,
        },
        navigation: {
          next: `#${id("checkEditFile")}`,
          canGoBack: () => !!spec.navigation.previous,
          previous: spec.navigation.previous,
          canSkip: spec.navigation.canSkip,
          skip: spec.navigation.next,
        },
      }),
      checkEditFile: {
        id: id("checkEditFile"),
        entry: () => console.log(`checkEditFile entry`),
        always: [
          {
            cond: (context) => {
              return !field.get(context);
            },
            actions: (context) => {
              context.dirtyFlags["file"] = context.dirtyFlags[field.name];
              delete context.dirtyFlags[field.name];
              context.data.file = undefined;
            },
            target: `#${id("editFile")}`,
          },
          {
            target: spec.navigation.next,
          },
        ],
      },
      editFile: prompt<TContext, any>({
        id: id("editFile"),
        entry: () => console.log(`editFile entry`),
        field: {
          name: "file",
          get: () => {
            // TODO: The contents could be loaded from the 'url' but in the current flow its not necessary
            return file ?? {};
          },
          set: (o) => {
            // console.log("Setting 'file' to:", o);
            file = o;
          },
        },
        component: PictureEditor,
        params: {
          view: spec.params.view,
          submitButtonText: window.o.i18n("shared.api.promptFile.saveImage"),
          cropShape: spec.params?.cropShape ?? null,
        },
        navigation: {
          next: `#${id("uploadOrSkip")}`,
          previous: spec.navigation.previous,
          canSkip: spec.navigation.canSkip,
          skip: spec.navigation.skip ?? spec.navigation.next,
        },
      }),
      uploadOrSkip: {
        id: id("uploadOrSkip"),
        entry: () => console.log(`uploadOrSkip entry`),
        always: [
          {
            cond: (context) => {
              return context.dirtyFlags["file"] && !!file && !!file.bytes;
            },
            target: `#${id("uploadFile")}`,
          },
          {
            cond: (context) =>
              context.onlyThesePages?.length > 0 && !context.onlyThesePages.find(o => o == field.name),
              //!context.dirtyFlags[field.name] && context.onlyWhenDirty,
            target: spec.navigation.skip ?? spec.navigation.next,
          },
          {
            actions: (context: TContext) => {
              context.messages[field.name] = window.o.i18n("shared.api.promptFile.pleaseSpecifyValidFile");
            },
            target: `#${id("checkPreviewFile")}`,
          },
        ],
      },
      uploadFile: {
        id: id("uploadFile"),
        on: {
          ...(<any>ipc(id("uploadFile"))),
        },
        entry: () => {
          console.log(`uploadFile entry`);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("shared.api.promptFile.uploadingFile"),
          });
        },
        invoke: {
          src: uploadFile.stateMachine(id("uploadFile")),
          data: {
            data: () => {
              return {
                fileName: file.fileName ?? "",
                mimeType: file.mimeType,
                bytes: file.bytes,
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: [
            {
              cond: (context, event) => event.data instanceof Error,
              target: "errorUploadingFile",
            },
            {
              actions: spec.uploaded,
              target: spec.navigation.next,
            },
          ],
          onError: "errorUploadingFile",
        },
      },
      errorUploadingFile: prompt<TContext, any>({
        field: "errorUploadingFile",
        entry: (context) => {
          context.data.errorUploadingFile = window.o.i18n("shared.api.promptFile.contextDataErrorUploadFile");
          context.dirtyFlags[field.name] = true;
        },
        component: HtmlViewer,
        isSensitive: true,
        params: {
          submitButtonText: window.o.i18n("shared.api.promptFile.tryAgain"),
          html: (context) => context.data.errorUploadingFile,
        },
        navigation: {
          next: `#${id("checkPreviewFile")}`,
        },
      }),
    },
  };
  return editDataFieldConfig;
}
