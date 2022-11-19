import {createAvatar} from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";
import {Utilities} from "../dapps/o-banking/chain/utilities";

export class AvataarGenerator {
    public static generate(seed:string) {
        if (!seed || seed.trim() == "") {
            return this.default();
        }

        if (seed.startsWith("0x") && Utilities.isAddress(seed)) {
            seed = Utilities.toChecksumAddress(seed);
        }

        return createAvatar(style, {
            seed: seed,
            // backgroundColor: "#65C9FF",
            topChance: 100,
            accessoriesChance: 0,
            facialHairChance: 0,
            top: ["shortHair"],
            hatColor: ["gray"],
            hairColor: ["gray"],
            clothes: ["collarAndSweater"],
            clothesColor: ["red"],
            eyes: ["default"],
            eyebrow: ["default"],
            mouth: ["default"],
            skin: ["brown"],
            style: "transparent",
            dataUri: true,
        });
    }

    public static default() {
        return createAvatar(style, {
            seed: "default",
            // backgroundColor: "#65C9FF",
            topChance: 100,
            accessoriesChance: 0,
            facialHairChance: 0,
            top: ["shortHair"],
            hatColor: ["gray"],
            hairColor: ["gray"],
            clothes: ["collarAndSweater"],
            clothesColor: ["red"],
            eyes: ["default"],
            eyebrow: ["default"],
            mouth: ["default"],
            skin: ["brown"],
            style: "transparent",
            dataUri: true,
        });
    }
}