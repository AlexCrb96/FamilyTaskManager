import { toast } from "react-toastify";

export const showErrorToast = (errorObj) => {
    const { message, details, status } = errorObj;

    if (details?.length) {
        toast.error(
            <div>
                <div>{message}</div>
                {details.map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>
        );
    } else {
        toast.error(`${status} - ${message}`);
    }
};