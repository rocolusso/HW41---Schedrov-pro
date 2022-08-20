'use strict';
const view = () => {
    return {
        createAlertMessageElement(messageText) {
            const messageWrapperElement = document.createElement('div');
            messageWrapperElement.classList.add('alert', 'alert-danger', 'alert__block');
            messageWrapperElement.setAttribute('role', 'alert');
            messageWrapperElement.innerHTML = messageText;
            return messageWrapperElement;
        },
        renderAlertMessage(message) {
            document.querySelector('.modal__alert').append(this.createAlertMessageElement(message));
        },
        removeAlertMessage() {
            document.querySelector('.alert').remove()
        },
        generateContactsListItemsElements(data) {
            return data.map(item => this.createContactListItemElement(item));
        },
        createContactListItemElement(data) {
            const listItemElement = document.createElement('li');
            listItemElement.classList.add('list-group-item', 'contact-item');
            listItemElement.setAttribute('data-contact-id', data.id);
            listItemElement.innerHTML = data.name;
            return listItemElement;
        },
        createButtonAddContact() {
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('btn', 'btn-primary', 'ps-4', 'pe-4');
            buttonElement.setAttribute('data-bs-toggle', 'modal');
            buttonElement.setAttribute('data-bs-target', '#contact__add__modal');
            buttonElement.setAttribute('id', 'add__contact__btn');
            buttonElement.innerHTML = 'Add Contact';
            return buttonElement;
        },
        renderSavedContact(contactListItemElement, contactData) {
            contactListItemElement.innerHTML = contactData.name;
        },
        renderContacts(contacts) {
            const contactsListElement = document.querySelector('.list-group');
            const contactsSortedByName = contacts.sort((a, b) => (a.name > b.name) ? 1 : -1);
            const contactsElements = this.generateContactsListItemsElements(contactsSortedByName);
            const phonebookWrapperElement = document.querySelector('.phonebook__wrapper');
            const searchElement = phonebookWrapperElement.querySelector('.search__input');

            document.getElementById('add__contact__btn').remove();
            document.querySelector('.btn__contact__add__wrapper').append(this.createButtonAddContact());

            searchElement.removeAttribute('disabled');

            try {
                if (contactsListElement.firstElementChild.classList.contains('empty')) {
                    contactsListElement.firstElementChild.remove();
                    contactsElements.forEach(element => contactsListElement.append(element));
                }
            } catch (e) {

            }
            contactsElements.forEach(element => contactsListElement.append(element));

        },
        renderSearchClearBtn() {
            const clearSearchFieldBtn = document.getElementById('clear__search');
            clearSearchFieldBtn.style.display = 'block';
        },
        renderContactInfo(contact) {
            const infoContainer = document.getElementById('modalContactInfoModalWrapper');

            const createShowInfoButtonElement = document.createElement('button');
            createShowInfoButtonElement.setAttribute('id', 'showContactInfoModal');
            createShowInfoButtonElement.classList.add('btn', 'btn-primary', 'ps-4', 'pe-4');
            createShowInfoButtonElement.setAttribute('data-bs-toggle', 'modal');
            createShowInfoButtonElement.setAttribute('data-bs-target', '#contactInfoModal');

            const createInfoModalElement = document.createElement('div');
            createInfoModalElement.classList.add('modal', 'fade');
            createInfoModalElement.setAttribute('id', 'contactInfoModal');
            createInfoModalElement.setAttribute('data-contact-id', contact.id);
            createInfoModalElement.setAttribute('tabindex', '-1');
            createInfoModalElement.setAttribute('aria-labelledby', 'exampleModalLabel');
            createInfoModalElement.setAttribute('aria-hidden', 'true');

            const createModalDialogElement = document.createElement('div');
            createModalDialogElement.classList.add('modal-dialog');

            const createModalContentElement = document.createElement('div');
            createModalContentElement.classList.add('modal-content');
            createModalContentElement.setAttribute('id', 'modalInfoBody');

            const createModalHeaderElement = document.createElement('div');
            createModalHeaderElement.classList.add('modal-header');

            const createModalHeaderTittleElement = document.createElement('h5');
            createModalHeaderTittleElement.classList.add('modal-title');
            createModalHeaderTittleElement.setAttribute('id', 'contact__info__modal__label');
            createModalHeaderTittleElement.innerHTML = 'Contact Info';

            const createModalHeaderButtonElement = document.createElement('button');
            createModalHeaderButtonElement.setAttribute('id', 'closeContactInfoBtn');
            createModalHeaderButtonElement.classList.add('btn-close');
            createModalHeaderButtonElement.setAttribute('data-bs-dismiss', 'modal');
            createModalHeaderButtonElement.setAttribute('aria-label', 'Close');

            createModalHeaderElement.append(createModalHeaderTittleElement, createModalHeaderButtonElement);

            const createModalBodyElement = document.createElement('div');
            createModalBodyElement.classList.add('modal-body', 'd-flex', 'flex-column');

            const contactDataFieldsData = [
                {
                    tittle: 'Name',
                    value: contact.name,
                },
                {
                    tittle: 'Phone',
                    value: contact.phoneNumber,
                },
                {
                    tittle: 'Position',
                    value: contact.position,
                }];
            const createDataFieldElement = (tittle, value) => {
                const dataElement = document.createElement('h5');
                dataElement.innerHTML = `${tittle} : ${value}`;
                return dataElement;
            }
            const contactDataElements = contactDataFieldsData.map(item => createDataFieldElement(item.tittle, item.value));

            contactDataElements.forEach(dataElement => createModalBodyElement.append(dataElement));

            const createModalFooterElement = document.createElement('div');
            createModalFooterElement.classList.add('modal-footer', 'contact__add__modal__controls', 'justify-content-start', 'flex-nowrap');

            const createModalFooterButtonCancelElement = document.createElement('button');
            createModalFooterButtonCancelElement.classList.add('btn', 'btn-outline-secondary', 'cancel__info');
            createModalFooterButtonCancelElement.setAttribute('data-bs-dismiss', 'modal');
            createModalFooterButtonCancelElement.innerHTML = 'Cancel';

            const createModalFooterButtonChangeElement = document.createElement('button');
            createModalFooterButtonChangeElement.classList.add('btn', 'btn-outline-dark', 'change__info');
            createModalFooterButtonChangeElement.innerHTML = 'Change';

            createModalFooterElement.append(createModalFooterButtonCancelElement, createModalFooterButtonChangeElement);
            createModalContentElement.append(createModalHeaderElement, createModalBodyElement, createModalFooterElement);
            createModalDialogElement.append(createModalContentElement);
            createInfoModalElement.append(createModalDialogElement);

            infoContainer.prepend(createShowInfoButtonElement);
            infoContainer.append(createInfoModalElement);
            return createShowInfoButtonElement.click();

        },
        renderChangeInfo(contactInfo) {
            const modalBodyElement = document.getElementById('modalInfoBody');
            const infoTittleElement = modalBodyElement.firstElementChild.querySelector('h5');
            const infoBodyElement = modalBodyElement.querySelector('.modal-body');
            const inputsData = [
                {
                    name: 'name',
                    value: contactInfo.name,
                    type: 'text',
                    placeholder: 'Name'

                },
                {
                    name: 'phoneNumber',
                    value: contactInfo.phoneNumber,
                    type: 'tel',
                    placeholder: 'Phone'
                },
                {
                    name: 'position',
                    value: contactInfo.position,
                    type: 'text',
                    placeholder: 'Position'
                }];
            const createInputElement = (name, value, type, placeholder) => {
                const inputElement = document.createElement('input');
                inputElement.classList.add('form-input', 'p-2', 'mt-2');
                inputElement.setAttribute('name', name);
                inputElement.setAttribute('value', value);
                inputElement.setAttribute('type', type);
                inputElement.setAttribute('placeholder', placeholder);
                return inputElement;
            }
            const inputsElements = inputsData.map(item => createInputElement(item.name, item.value, item.type, item.placeholder));
            const modalFooterElement = modalBodyElement.lastElementChild;
            const createButtonRemoveContactElement = document.createElement('button');

            infoTittleElement.innerHTML = 'Change Contact Info';
            infoBodyElement.querySelectorAll('h5').forEach(item => item.remove());
            inputsElements.forEach(inputElement => infoBodyElement.append(inputElement));


            modalFooterElement.firstElementChild.removeAttribute('data-bs-dismiss');
            modalFooterElement.firstElementChild.classList.remove('cancel__info');
            modalFooterElement.firstElementChild.classList.add('cancel__change');

            modalFooterElement.lastElementChild.classList.remove('change__info', 'btn-outline-dark');
            modalFooterElement.lastElementChild.classList.add('save__change', 'btn-outline-success');
            modalFooterElement.lastElementChild.innerHTML = 'Save';


            createButtonRemoveContactElement.classList.add('btn', 'btn-warning', 'remove__contact');
            createButtonRemoveContactElement.innerHTML = 'Remove Contact';
            modalFooterElement.append(createButtonRemoveContactElement);

        },
        renderCancelChangeInfo(contact) {
            const modalBodyElement = document.getElementById('modalInfoBody');
            const infoTittleElement = modalBodyElement.firstElementChild.querySelector('h5');
            const infoBodyElement = modalBodyElement.querySelector('.modal-body');
            const contactDataFieldsTemplate = [
                {
                    tittle: 'Name',
                    value: contact.name,
                },
                {
                    tittle: 'Phone',
                    value: contact.phoneNumber,
                },
                {
                    tittle: 'Position',
                    value: contact.position,
                }];
            const createDataFieldElement = (tittle, value) => {
                const dataElement = document.createElement('h5');
                dataElement.innerHTML = `${tittle} : ${value}`;
                return dataElement;
            }
            const contactDataElements = contactDataFieldsTemplate.map(item => createDataFieldElement(item.tittle, item.value));
            const modalFooterElement = modalBodyElement.lastElementChild;

            modalFooterElement.lastElementChild.remove();
            modalFooterElement.firstElementChild.classList.remove('cancel__change');
            modalFooterElement.firstElementChild.classList.add('cancel__info');
            modalFooterElement.firstElementChild.setAttribute('data-bs-dismiss', 'modal');

            modalFooterElement.lastElementChild.classList.remove('save__change', 'btn-outline-success');
            modalFooterElement.lastElementChild.classList.add('change__info', 'btn-outline-dark');
            modalFooterElement.lastElementChild.innerHTML = 'Change';

            infoTittleElement.innerHTML = 'Contact Info';
            infoBodyElement.querySelectorAll('input').forEach(item => item.remove());
            contactDataElements.forEach(contactData => infoBodyElement.append(contactData));
        },

        cleanContactsContainer() {
            const contactsListElement = document.querySelector('.list-group');
            contactsListElement.querySelectorAll('li').forEach(contactListItemElement => contactListItemElement.remove());
        },
        removeSearchClearBtn() {
            const clearSearchFieldBtn = document.getElementById('clear__search');
            clearSearchFieldBtn.style.display = 'none';
        },
        removeContactInfo() {
            const contactInfoModalBlock = document.getElementById('modalContactInfoModalWrapper');
            contactInfoModalBlock.firstElementChild.remove();
            contactInfoModalBlock.firstElementChild.remove();
        },
        removeContactFromList(id) {
            const contactsListElement = document.querySelector('.list-group');
            const listItemsElements = Array.from(contactsListElement.querySelectorAll('li'));
            const elementToRemove = listItemsElements.filter(element => +element.getAttribute('data-contact-id') === id)[0];
            elementToRemove.remove();
        },

        createInitContactListItemElement() {
            const listItemElement = document.createElement('li');
            listItemElement.classList.add('list-group-item', 'empty');
            listItemElement.innerHTML = 'Contacts list is empty';
            return listItemElement;
        },
        renderStartPage() {
            const contactListWrapper = document.getElementById('contactListWrapper');
            const searchElement = document.querySelector('.search__input');
            document.getElementById('add__contact__btn').remove();

            const contactsListElements = contactListWrapper.firstElementChild;
            contactsListElements.firstElementChild.remove();
            contactsListElements.append(this.createInitContactListItemElement());
            contactListWrapper.append(this.createButtonAddContact());

            searchElement.setAttribute('disabled', '');
        }
    }
}
