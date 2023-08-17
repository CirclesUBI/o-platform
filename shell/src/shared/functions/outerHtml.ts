export function outerHTML(node) {
    if (!node) {
        return '';
    }
    return node.outerHTML || new XMLSerializer().serializeToString(node);
}