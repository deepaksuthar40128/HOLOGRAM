const genError = (code, msz) => {
    let err = new Error(msz);
    err.status = code;
    return err;
}

export default genError;