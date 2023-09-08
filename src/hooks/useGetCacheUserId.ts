import { useEffect, useState } from "react";
import { CACHE_USER_LOGIN_ID, CACHE_USER_LOGIN_ROLE_NAME } from "../utils/StorageUtil";
import { Storage } from "@ionic/storage";

export default function useGetCacheUserId() {
    const [logonUserId, setLogonUserId] = useState<"" | string>("");

    useEffect(() => {
        (async function () {
            const store = new Storage();
            await store.create();
            const _logonUserId = await store.get(CACHE_USER_LOGIN_ID);
            setLogonUserId(_logonUserId || '');
        })();
    }, []);

    return logonUserId;
}
