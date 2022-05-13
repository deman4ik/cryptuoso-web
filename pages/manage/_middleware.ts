import dayjs from "@cryptuoso/libs/dayjs";
import { withAuth } from "next-auth/middleware";
import { UserAuthData } from "pages/api/auth/[...nextauth]";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (!token) return false;
            if (!token.user) return false;
            const exp = token.exp as number;
            const user = token.user as UserAuthData;
            if (user.exp * 1000 < dayjs.utc().valueOf() || exp * 1000 < dayjs.utc().valueOf()) return false;
            if (!user.allowedRoles.includes("manager")) return false;
            return true;
        }
    }
});
