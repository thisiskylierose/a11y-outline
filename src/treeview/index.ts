// https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView

import { ItemType } from '../index';

const createLink = (item: ItemType, id: string) => {
  const link = document.createElement('a');

  link.href = item.href;
  link.textContent = item.label;
  link.id = `${id}-link`;
  link.tabIndex = -1;
  link.setAttribute('role', 'presentation');

  return link;
};

const toggleGroup = (item: HTMLElement) => {
  const isExpanded = item.getAttribute('aria-expanded') === 'true';
  item.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
};

const createToggle = () => {
  const toggle = document.createElement('button');

  toggle.setAttribute('aria-hidden', 'true');
  toggle.tabIndex = -1;

  toggle.addEventListener('click', function (event) {
    event.preventDefault();
    const item = this.parentElement;
    toggleGroup(item);
  });

  return toggle;
};

const createGroup = (items: ItemType[], id: string) => {
  const group = createList(items, id);

  group.setAttribute('role', 'group');

  return group;
};

const createListItem = (item: ItemType, id: string) => {
  const li = document.createElement('li');

  li.id = id;
  li.setAttribute('role', 'treeitem');
  li.setAttribute('aria-labelledby', `${id}-link`);
  li.setAttribute('aria-selected', 'false');
  li.appendChild(createLink(item, id));

  if (item.children.length) {
    li.setAttribute('aria-expanded', 'true');
    li.appendChild(createToggle());
    li.appendChild(createGroup(item.children, id));
  }

  return li;
};

const createList = (items: ItemType[], id: string) => {
  const list = document.createElement('ul');

  items.forEach(function (item, index) {
    list.appendChild(createListItem(item, `${id}.${index}`));
  });

  return list;
};

const nextItem = (
  element: HTMLElement,
  direction: 'parent' | 'end' | 'start' | 'up' | 'down',
  query?: RegExpConstructor,
) => {
  let next;

  /*
  if (direction === 'parent') {
    if (element.parentElement.getAttribute('role') === 'group') {
      next = element.parentElement.parentElement;
    }
  } else {
    const tree = element.closest('[role="tree"]');
    const elements = tree.querySelectorAll('[role="treeitem"]');
    const hidden = tree.querySelectorAll('[aria-expanded="false"] [role="treeitem"]');

    let i = elements.indexOf(element);

    if (direction === 'start') i = -1;
    if (direction === 'end') i = elements.length;

    const dir = direction === 'up' || direction === 'end' ? -1 : 1;
    if (!query) {
      i += dir;
    }
    while (i >= 0 && i < elements.length) {
      if (indexOf(hidden, elements[i]) === -1) {
        if (!query || query.test(elements[i].textContent)) {
          next = elements[i];
          break;
        }
      }
      i += dir;
    }
  }

  activate(next);
  */
};

const onKeyDown = (event: KeyboardEvent) => {
  /*
  if (!(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
    const element = (event.target as HTMLElement).querySelector('[aria-selected="true"]');

    switch (event.key) {
      case 'End':
        event.preventDefault();
        nextItem(element, 'end');
        break;
      case 'Home':
        event.preventDefault();
        nextItem(element, 'start');
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextItem(element, 'up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        nextItem(element, 'down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (element.getAttribute('aria-expanded') === 'true') {
          toggleGroup(element);
        } else {
          nextItem(element, 'parent');
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (element.getAttribute('aria-expanded') === 'true') {
          nextItem(element, 'down');
        } else if (element.hasAttribute('aria-expanded')) {
          toggleGroup(element);
        }
        break;
      case 'Enter':
        if (element) {
          const link = element.querySelector('a');
          link.click();
        }
        break;
      default:
        if (event.key.length === 1) {
          const s = typeahead(event.key);
          const r = new RegExp('^' + s, 'i');
          nextItem(element, 'down', r);
        }
    }
  }
  */
};

const treeview = (items: ItemType[], id: string): HTMLUListElement => {
  const tree = createList(items, id);

  tree.id = id;
  tree.tabIndex = 0;
  tree.className = 'treeview';
  tree.setAttribute('role', 'tree');

  tree.addEventListener('keydown', onKeyDown);

  return tree;
};

export default treeview;
