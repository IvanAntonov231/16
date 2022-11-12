class ContactsApi {
  static URL = 'https://62054479161670001741b708.mockapi.io/api/contacts';

  static request(config) {
    const conf = {
      uri: '',
      method: 'GET',
      data: null,
      error: 'API request error.',
      ...config,
    };
    
    return fetch(`${this.URL}/${conf.uri}`, {
      method: conf.method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: conf.data ? JSON.stringify(conf.data) : undefined,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(conf.error);
      });
  }
  
  static getList() {
    return this.request({ error: 'Can not fetch contacts list.' });
  }

  static getOne(id) {
    return this.request({ uri: id, error: `Can not fetch contact with id '${id}'.` });
  }

  static create(contact) {
    return this.request({ method: 'POST', data: contact, error: `Can not create contact.` });
  }

  static update(id, contact) {
    return this.request({ uri: id, method: 'PUT', data: contact, error: `Can not update contact.` });
  }

  static delete(id) {
    return this.request({ uri: id, method: 'DELETE', error: `Can not delete contact.` });
  }
}
const CONTACT_ITEM_SELECTOR = '.contactItem';
const DELETE_BTN_CLASS = 'deleteBtn';
const EDIT_BTN_CLASS = 'editBtn';

const contactForm = document.querySelector('#contactForm');
const inputs = document.querySelectorAll('.formInput');
const contactListEl = document.querySelector('#contactList');
const contactItemTemplate = document.querySelector('#contactItemTemplate').innerHTML;
let contactList = [];
let editContactId = null;

contactForm.addEventListener('submit', onContactBtnSubmit);
contactListEl.addEventListener('click', onContactListClick);

init();

function init() {
  ContactsApi.getList()
    .then(list => contactList = list)
    .then(renderContactList)
    .catch(handleError);
}


function onContactBtnSubmit(e) {
  e.preventDefault();

  const contact = getContact();

  if(!isContactValid(contact)) {
    return handleError(new Error('Incorrect input data.'));
  }

  addContact(contact);
  clearContactForm();
}

function onContactListClick(e) {
  const id = getContactElId(e.target);
  const classList = e.target.classList;

  if(classList.contains(DELETE_BTN_CLASS)) {
    return removeContact(id);
  }
  if (classList.contains(EDIT_BTN_CLASS)) {
    return fillContactForm(id);
  }
}


function getContact() {
  const contact = {
    id: editContactId,
  };

  inputs.forEach(input => {
    contact[input.name] = input.value;
  })

  return contact;
}

function isContactValid(contact) {
  return !isEmpty(contact.firstName)
    && !isEmpty(contact.lastName)
    && isPhone(contact.phone);
}

function isPhone(phone) {
  return !isEmpty(phone) && !isNaN(phone);
}

function isEmpty(str) {
  return typeof str === 'string' && str.trim() === '';
}

function fillContactForm(id) {
  const contact = contactList.find(c => c.id === id);
  editContactId = id;

  for (let prop in contact) {
    if (contactForm.elements.hasOwnProperty(prop)) {
      contactForm.elements[prop].value = contact[prop];
    }
  }
}

function clearContactForm() {
  contactForm.reset();
  editContactId = null;
}

function addContact(contact) {
  if (contact.id) {
    ContactsApi
      .update(contact.id, contact)
      .catch(handleError);

    replaceContactEl(contact.id, contact);
    contactListUpdate(contact.id, contact);
  } else {
    ContactsApi
      .create(contact)
      .then((newContact) => {
        renderContact(newContact);
        contactListAdd(newContact);
      })
      .catch(handleError);
  }
}

function removeContact(id) {
  const contactEl = getContactElById(id);

  ContactsApi
    .delete(id)
    .catch(handleError);

  contactEl.remove();
}

function renderContactList(contacts) {
  const html = contacts.map(getContactHTML).join('');

  contactListEl.innerHTML = html;
}

function renderContact(contact) {
  contactListEl.insertAdjacentHTML('beforeend', getContactHTML(contact));
}

function replaceContactEl(id, contact) {
  const oldContactEl = getContactElById(id);
  oldContactEl.outerHTML = getContactHTML(contact);
}

function contactListUpdate(id, contact) {
  const oldContact = contactList.find(c => c.id === id);

  Object.keys(contact).forEach(key => oldContact[key] = contact[key]);
}

function contactListAdd(contact) {
  contactList.push(contact);
}

function createContactEl(contact) {
  const table = document.createElement('table');

  table.innerHTML = getContactHTML(contact);

  return table.querySelector(CONTACT_ITEM_SELECTOR);
}

function getContactHTML(contact) {
  let contactItemHTML = contactItemTemplate;

  for (let prop in contact) {
    contactItemHTML = contactItemHTML.replace(`{{${prop}}}`, contact[prop]);
  }

  return contactItemHTML;
}

function getContactElById(id) {
  return contactListEl.querySelector(`[data-id="${id}"]`);
}

function getContactElId(el) {
  return el.closest(CONTACT_ITEM_SELECTOR).dataset.id;
}

function handleError(e) {
  alert(e.message);
}