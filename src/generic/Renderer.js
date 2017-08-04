import LayoutItem from './LayoutItem';
import Component  from './Component';

class Renderer {
    /**
     * @param  {object}     state
     * @param  {object}     parent
     * @param  {LayoutItem} node
     * @return {(HTMLElement|DocumentFragment)}
     */

    static renderNode(state, parent, node) {
        if (typeof (node.forEach) === 'function') {
            // Multiple nodes

            return Renderer.renderNodeForEach(state, parent, node);
        }

        // Single node

        if (typeof node.if === 'function') {
            // If `if` present and fails, skip

            if (!Boolean(node.if(state, parent))) return document.createTextNode('');
        }

        const Fn = node.component;
        const instance = new Fn(state, parent);
        const temp = document.createElement('div');

        const children = node.children.reduce((frag, child) => {
            frag.appendChild(Renderer.renderNode(state, instance.props || {}, child));

            return frag;
        }, document.createDocumentFragment());

        let html = '';
        let el   = null;

        if (instance instanceof Component) {
            // Else, class style

            html = instance.render(instance.props, children);

            // Add a reference to instance in the layout tree

            node.instances.push(instance);
        } else {
            // Assume pure function style

            html = node.component(state, parent);
        }

        temp.innerHTML = html;

        el = temp.firstElementChild;

        if (instance.refs) {
            instance.refs.root = el;
        }

        return el;
    }

    /**
     * @param  {object} state
     * @param  {object} parent
     * @param  {LayoutItem} node
     * @return {DocumentFragment}
     */

    static renderNodeForEach(state, parent, node) {
        const iterable = node.forEeach(state, parent);
        const frag = document.createDocumentFragment();

        if (iterable && Array.isArray(iterable)) {
            return iterable.reduce((frag, item) => {
                frag.appendChild(Renderer.renderNode(state, item, {
                    component: node.component,
                    children: node.children,
                    instances: node.instances
                }));

                return frag;
            }, document.createDocumentFragment());
        }

        return frag;
    }

    static buildTreeFromNode(layoutItemRaw) {
        const layoutItem = new LayoutItem();

        if (typeof layoutItemRaw === 'function') {
            // Short hand (function/class) style

            layoutItem.component = layoutItemRaw;
        } else {
            // Object style

            Object.assign(layoutItem, layoutItem);

            layoutItem.children = layoutItem.children.map(Renderer.buildTreeFromNode);
        }

        return layoutItem;
    }
}

export default Renderer;