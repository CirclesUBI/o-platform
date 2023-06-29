export function outerHTML(node) {
    return node.outerHTML || new XMLSerializer().serializeToString(node);
}