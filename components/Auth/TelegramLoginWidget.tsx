import { useEffect } from "react";

export function TelegramLoginWidget({
    onAuth,
    buttonSize = "large",
    borderRadius = 4,
    showUserPic = true
}: {
    onAuth: (data: any) => void;
    buttonSize?: "large" | "medium" | "small";
    borderRadius?: number;
    showUserPic?: boolean;
}) {
    let instance: HTMLDivElement | null = null;
    useEffect(() => {
        if (instance) {
            (window as any).onTelegramAuth = onAuth;
            const script = document.createElement("script");
            script.src = "https://telegram.org/js/telegram-widget.js?7";
            script.setAttribute("data-telegram-login", `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`);
            script.setAttribute("data-size", buttonSize);
            script.setAttribute("data-radius", `${borderRadius}`);
            script.setAttribute("data-request-access", "write");
            script.setAttribute("data-userpic", `${showUserPic}`);
            script.setAttribute("data-onauth", "onTelegramAuth(user)");
            script.async = true;
            instance.appendChild(script);
        }
    }, [instance, onAuth, borderRadius, buttonSize, showUserPic]);

    return <div ref={(ref) => (instance = ref)} style={{ alignSelf: "center" }} />;
}
