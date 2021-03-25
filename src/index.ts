import aria from 'aria-api';
import dialogPolyfill from 'dialog-polyfill';
import treeview from './treeview';

const DIALOG_ID = 'a11y-outline';

export type ItemType = {
  label: string;
  element: HTMLElement;
  children: ItemType[];
  href: string;
};

const createItem = (element: HTMLElement, index: number): ItemType => {
  let label = String(aria.getAttribute(element, 'roledescription') || aria.getRole(element)).toUpperCase();

  if (aria.matches(element, 'heading')) {
    label = `${label} ${aria.getAttribute(element, 'level')}`;
  }

  const name = aria.getName(element, null, true);

  if (name) {
    label = `${label} ${name}`;
  }

  return { label, element, children: [], href: `#${index}` };
};

const createTree = (role: string) => {
  const matches = aria.querySelectorAll(document, role).filter((element: HTMLElement) => {
    return !aria.matches(element, ':hidden');
  });

  const items = [...matches].reduce<ItemType[]>((acc, element, index) => {
    const item = createItem(element, index);
    const level = aria.getAttribute(item.element, 'level');
    const last = [...acc].pop();

    if (last && (level > aria.getAttribute(last.element, 'level') || last.element.contains(item.element))) {
      return [...acc.slice(0, -1), { ...last, children: [...last.children, item] }];
    }

    return [...acc, item];
  }, []);

  const tree = treeview(items, `${DIALOG_ID}-${role}`);

  console.log(tree);

  return tree;
};

const updateVisiblePane = (value: string) => {
  const id = `${DIALOG_ID}-${value}`;
  const dialog = document.getElementById(DIALOG_ID);

  if (!document.getElementById(id)) {
    dialog.appendChild(createTree(value));
  }

  const trees = dialog.querySelectorAll('ul[role="tree"]');

  Array.from(trees).forEach((tree: HTMLUListElement) => {
    tree.hidden = tree.id !== id;
  });
};

const createDialog = (): HTMLDialogElement => {
  const dialog = document.createElement('dialog');

  dialog.id = DIALOG_ID;
  dialog.addEventListener('close', function () {
    dialog.remove();
  });

  document.body.appendChild(dialog);

  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  return dialog;
};

const createSelect = (): HTMLSelectElement => {
  const select = document.createElement('select');

  select.innerHTML =
    '<option value="landmark">Landmarks</option>' +
    '<option value="heading">Headings</option>' +
    '<option value="list">Lists</option>' +
    '<option value="link">Links</option>';

  select.addEventListener('change', function () {
    updateVisiblePane(select.value);
  });

  return select;
};

const createLink = (): HTMLLinkElement => {
  const link = document.createElement('link');

  link.rel = 'stylesheet';
  link.href = 'https://xi.github.io/a11y-outline/outline.css';

  return link;
};

const outline = () => {
  const dialog = createDialog();
  const select = createSelect();
  const link = createLink();

  dialog.appendChild(link);
  dialog.appendChild(select);
  dialog.showModal();

  updateVisiblePane(select.value);
};

outline();
