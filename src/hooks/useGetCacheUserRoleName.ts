import { useEffect, useState } from "react";
import { CACHE_USER_LOGIN_ROLE_NAME } from "../utils/StorageUtil";
import { Storage } from "@ionic/storage";

export default function useGetCacheUserRoleName() {
    // null means is in loading state
    const [roleName, setRoleName] = useState<null | string>(null);

    useEffect(() => {
        (async function () {
            const store = new Storage();
            await store.create();
            const _roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
            setRoleName(_roleName || '');
        })();
    }, []);

    return roleName;
}
