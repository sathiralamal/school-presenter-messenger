import { useEffect, useState } from "react";
import { TENANT_ID } from "../utils/StorageUtil";
import { Storage } from "@ionic/storage";

export default function useGetCacheTenantId() {
    const [tenantId, setTenantId] = useState<"" | string>("");

    useEffect(() => {
        (async function () {
            const store = new Storage();
            await store.create();
            const _tenantId = await store.get(TENANT_ID);
            setTenantId(_tenantId || "");
        })();
    }, []);

    return tenantId;
}
