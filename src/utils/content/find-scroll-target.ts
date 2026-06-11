


function findScrollableParent(el: Element | null):
    Element | Document['scrollingElement'] {

    while (el && el !== document.body) {
        const style = getComputedStyle(el);

        if (
            (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight
        ) {
            return el;
        }

        el = el.parentElement;
    }
    return document.scrollingElement;
}

export function findScrollTarget(mouseTarget: EventTarget | null): Element | null {

    if (mouseTarget instanceof Element) {
        const target = findScrollableParent(mouseTarget);
        if (target) return target;
    }

    return document.scrollingElement;
}