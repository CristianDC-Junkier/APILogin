let user = null;

export const setSession = (u) => {
    user = u;
};

export const getSession = () => user;
