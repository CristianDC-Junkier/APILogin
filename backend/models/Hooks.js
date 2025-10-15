const { UserAccount, RefreshToken } = require("./Relations");

/**
 * Hook: antes de actualizar un UserAccount.
 * 
 * - Incrementa el campo `version` del UserAccount siempre que sea < 100000.
 */
UserAccount.beforeUpdate((user, options) => {
    if (user.version < 100000) {
        user.version += 1;
    } else {
        user.version = 0;
    }
});

/**
 * Hook: después de actualizar un UserAccount.
 * 
 * - Destruir todos los refresh tokens asociados al usuario modificado
 */
UserAccount.afterUpdate(async (user, options) => {
    if (!options.skipRefreshTokens) {
        await RefreshToken.destroy({ where: { userId: user.id } });
    }
});

