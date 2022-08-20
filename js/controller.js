'use strict';
const controller = (model, view, options) => {
    const {keyDataLocalStorage, formId} = options;
    const searchElement = document.querySelector('.phonebook__content__search');
    model.init(keyDataLocalStorage);

    const searchWrapperElementHandler = (e) => {
        if (e.target.classList.contains('search__input')) {
            e.target.addEventListener('input', searchFieldHandler);
        } else if (e.target.classList.contains('clear__search')) {
            e.target.previousElementSibling.value = '';
            view.removeSearchClearBtn();
            view.cleanContactsContainer();
            view.renderContacts(model.getData());
        }
    }

    if (model.getData()) {
        view.renderContacts(model.getData());
        searchElement.addEventListener('click', searchWrapperElementHandler);
    }

    const getContactData = (contactId) => {
        const data = model.getData().filter(itemContact => itemContact.id === contactId)[0];
        return Object.freeze(data);
    }

    const formAddContactHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = document.getElementById('addContact');

        const formLocker = (formElement) => {
            const locker = formElement.querySelector('fieldset');
            return {
                lock() {
                    locker.setAttribute('disabled', '');
                },
                unlock() {
                    locker.removeAttribute('disabled');
                }
            }
        }

        if (e.target.classList.contains('cancel__add') || e.target.classList.contains('btn-close')) {
            formLocker(form).lock();
            form.reset();
            formLocker(form).unlock();
            try {
                view.removeAlertMessage();
            } catch (e) {
            }
        } else if (e.target.type === 'submit') {
            try {
                view.removeAlertMessage();
            } catch (e) {
            }

            const inputs = Array.from(form.querySelectorAll('input'));
            const closeModalBtn = document.getElementById('contact__add__modal').querySelector('.btn-close');
            const searchElement = document.querySelector('.phonebook__content__search');

            formLocker(form).lock();

            const data = inputs.reduce((acc, input) => {
                if (!input.value) return
                try {
                    acc[input.name] = input.value;
                    acc.id = model.currentId;
                    return acc
                } catch (e) {

                }
            }, {});

            if (data !== undefined) {
                model.setData(data);
                form.reset();
                model.init(keyDataLocalStorage);
                closeModalBtn.click();
                formLocker(form).unlock();

                if (model.getData().length === 1) {
                    view.renderContacts(model.getData());
                } else if (model.getData().length > 1) {
                    view.renderContacts([model.lastContactData()]);
                }

                searchElement.addEventListener('click', searchWrapperElementHandler);

            } else {
                form.reset();
                formLocker(form).unlock();
                view.renderAlertMessage('Error! Please fill contact info correctly!')
            }
        } else {

            try {
                view.removeAlertMessage();
            } catch (e) {
            }

        }

    }

    const searchFieldHandler = (e) => {
        if (e.target.value !== ''.trim()) {
            const data = model.getData().slice(0);
            const searchedContacts = data.filter((itemContact) => {
                return itemContact.name.includes(e.target.value) || itemContact.phoneNumber.includes(e.target.value)
            });
            view.renderSearchClearBtn();
            view.cleanContactsContainer();
            view.renderContacts(searchedContacts);

        } else {
            view.removeSearchClearBtn();
            view.cleanContactsContainer();
            view.renderContacts(model.getData());
        }
    }

    const changeInfoHandler = (e) => {
        e.stopPropagation();
        const infoContainer = e.target.closest('#modalContactInfoModalWrapper');
        const id = +infoContainer.lastElementChild.getAttribute('data-contact-id');

        if (e.target.classList.contains('cancel__change')) {
            view.renderCancelChangeInfo(getContactData(id));
            infoContainer.removeEventListener('click', changeInfoHandler);
        } else if (e.target.classList.contains('save__change')) {

            const contactsListElement = document.getElementsByTagName('ul')[0];
            const listItemsElements = Array.from(contactsListElement.querySelectorAll('li'));
            const currentListItemElement = listItemsElements.filter(liElement => +liElement.getAttribute('data-contact-id') === id)[0];

            const inputs = Array.from(e.target.parentElement.previousElementSibling.querySelectorAll('input'));
            const dataContactsWithoutCurrent = model.getData().filter(contact => contact.id !== id);

            const dataCurrentContactToSave = inputs.reduce((acc, input) => {
                acc[input.name] = input.value;
                acc['id'] = id;
                return acc;
            }, {});

            dataContactsWithoutCurrent.push(dataCurrentContactToSave);
            model.updateData(dataContactsWithoutCurrent);
            model.init(keyDataLocalStorage);


            view.renderSavedContact(currentListItemElement, getContactData(id));
            view.renderCancelChangeInfo(getContactData(id));
            infoContainer.removeEventListener('click', changeInfoHandler);


        } else if (e.target.classList.contains('remove__contact')) {
            const contactsToSave = model.getData().filter(itemContact => itemContact.id !== id);
            const updateData = () => {
                const closeInfoBtn = document.getElementById('modalInfoBody').querySelector('.btn-close');
                model.updateData(contactsToSave);
                model.init(keyDataLocalStorage);
                closeInfoBtn.click();
            }

            if (!contactsToSave.length) {
                const form = document.getElementById(formId);
                const contactsListElement = document.getElementsByTagName('ul')[0];
                const searchFieldElement = document.querySelector('.phonebook__content__search');

                updateData();
                contactsListElement.removeEventListener('click', listHandler);
                form.removeEventListener('submit', formAddContactHandler);
                searchFieldElement.removeEventListener('click', searchWrapperElementHandler);
                view.renderStartPage();
                form.addEventListener('submit', formAddContactHandler);
                contactsListElement.addEventListener('click', listHandler);

            } else {
                updateData();
                view.removeContactFromList(id);
            }

        }


    }

    const infoHandler = (e) => {
        e.stopPropagation();
        const infoContainer = e.target.closest('#modalContactInfoModalWrapper');

        switch (true) {
            case e.target.classList.contains('cancel__info') || e.target.classList.contains('btn-close'):
                infoContainer.removeEventListener('click', infoHandler);
                infoContainer.removeEventListener('click', changeInfoHandler);
                view.removeContactInfo();
                break;
            case e.target.classList.contains('change__info'):
                const id = +infoContainer.lastElementChild.getAttribute('data-contact-id');
                view.renderChangeInfo(getContactData(id));
                infoContainer.addEventListener('click', changeInfoHandler);
        }
    }

    const listHandler = (e) => {
        if (!e.target.classList.contains('empty')) {
            const contactId = +e.target.getAttribute('data-contact-id');
            const infoContainer = document.getElementById('modalContactInfoModalWrapper');
            view.renderContactInfo(getContactData(contactId));
            infoContainer.addEventListener('click', infoHandler);
        }
    }

    const form = document.getElementById(formId);
    const contactsListElement = document.getElementsByTagName('ul')[0];

    form.addEventListener('click', formAddContactHandler);
    contactsListElement.addEventListener('click', listHandler);

    return undefined
}
