const { UserAccount } = require("./Relations");

/**
 * Hook: antes de actualizar un UserAccount.
 * 
 * - Incrementa el campo `version` del UserAccount siempre que sea < 100000.
 */
UserAccount.beforeUpdate((user) => {
    if (user.version < 100000) {
        user.version += 1;
    } else {
        user.version = 0;
    }
});
