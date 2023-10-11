import Axios from "axios";

export const create = async (data) =>
await Axios.post("http://localhost:5000/api/product", data);

export const list = async () =>{
 return await Axios.get("http://localhost:5000/api/product");
};

export const remove = async(id) =>
 await Axios.delete("http://localhost:5000/api/product/"+id);

 export const read = async (id) =>{
    return await Axios.get("http://localhost:5000/api/product/"+id);
   };

   export const update = async (id,data) =>{
    return await Axios.put("http://localhost:5000/api/product/"+id,data);
   };