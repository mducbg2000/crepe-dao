import axios, { ResponseType } from "axios";
import appConfig from "../config";

interface IpfsAddFileResult {
  Name: string;
  Hash: string;
  Size: string;
}

export const addFile = async (file: File | Blob) => {
  const form = new FormData();
  form.append("file", file);
  const response = await axios.postForm(
    `${appConfig.VITE_IPFS_API_ENDPOINT}/api/v0/add`,
    form,
    {
      headers: {
        "content-type":
          "multipart/form-data; boundary=---011000010111000001101001",
      },
      auth: {
        username: appConfig.VITE_IPFS_API_KEY,
        password: appConfig.VITE_IPFS_API_SECRET,
      },
    },
  );
  return (response.data as IpfsAddFileResult).Hash;
};

export const retrieveFile = async (
  cid: string,
  responseType: ResponseType = "arraybuffer",
) => {
  const response = await axios.get(`https://dweb.link/ipfs/${cid}`, {
    responseType: responseType,
  });
  return response.data;
};
