import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const errorNotify = (msz) => {
    toast.error(msz);
}

export const successNotify = (msz) => {
    toast.success(msz);
}

export const warningNotify = (msz) => {
    toast.warn(msz)
}