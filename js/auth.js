let date = new Date(Date.now() + 86400e3);
date = date.toUTCString();

documet.cookie = `user = Котэ; secure; samesitwe=lax; expires="${date};`;