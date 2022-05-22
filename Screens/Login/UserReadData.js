import { db } from '../../Database/DatabaseConfig/firebase';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore';
import { UserInfo } from '../../Database/Data/User/userInfo';

let readDoc = {}; 
export let userInfoDatas = [];



export default async function  Read() {
  const myDoc = doc(db, 'CollectionNameCarpoolTicket', 'UserInfo'); 

  const docSnap =  await getDoc(myDoc);

  
    if (docSnap.exists()) {
      readDoc = docSnap.data();
      userInfoDatas = readDoc.UserInfo;
   
  }
}