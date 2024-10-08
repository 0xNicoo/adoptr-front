import { Image } from '@nextui-org/react';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const ChatList = ({id, s3Url, title, type, handleClick}) => {
    return(
        <div
        key={id}
        className='flex items-center justify-between bg-gray-100 p-4 mb-2 rounded-3xl shadow-md transition-colors duration-200 hover:bg-gray-200 cursor-pointer'
        onClick={() => handleClick(id)}
        >
        <div className='flex-1 flex items-center'>
          <div className='mr-6'>
            <Image 
              src={s3Url} 
              alt="Descripción de la imagen" 
              width={48} 
              height={48} 
              className="rounded-full"
            />
          </div>
          <div>
            <p className={`${inter.className} text-sm text-gray-600`}>
              {type}: <div className='font-bold'>{title}</div>
            </p>
          </div>
        </div>
      </div>
    )
}

export default ChatList;