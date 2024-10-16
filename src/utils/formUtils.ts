import FormData from "form-data";

export const getFormLength = (form: FormData): Promise<number> => {
    return new Promise((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(length);
      });
    });
  };