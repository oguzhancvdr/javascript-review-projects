import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function(url){
  try {
    /**
     * Promise.race() will reject ot fullfilled which is the first occurs
     * if first occuring is the rejecting then catch block will throw its reject message
     * or else it will return data successfully
     */
    // reject promise after 3 sec
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    
    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // resolved value of this async function
    
  } catch (error) {
    // now our promise will reject promise if error occurs
    throw error;
  }
}