let updateUserState = null;

export const setUpdateUserState = (updateFunc) => {
    updateUserState = updateFunc;
};

export const getUpdateUserState = () => updateUserState;
