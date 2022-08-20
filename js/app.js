'use strict';
void function () {

    const options = {
        keyDataLocalStorage: 'ContactsData',
        formId: 'contact__add__modal',
    }

    const app = controller(
        model(),
        view(),
        options
    )

}();
