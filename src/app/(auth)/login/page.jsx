import "../../globals.css"
import localFont from 'next/font/local';
import LoginForm from "./components/loginForm"
import Link from 'next/link';

const gentyDemo = localFont({
    src: '../../../resources/font/GentyDemo-Regular.ttf',
    display: 'swap',
  });

export default function Login() {
    return (
        <>
            <section className="bg-[url('/images/sectionLogin-background.png')] bg-repeat bg-center bg-auto h-[33vh] flex flex-col justify-between ">
                <div className="text-center mt-8">
                    <Link href="/" className={`${gentyDemo.className} text-7xl shadow-gray-500 text-shadow-lg`}>
                        <span className="text-primary-blue">Adop</span>
                        <span className="text-primary-orange">tr</span>
                    </Link>
                </div>
                <div className="flex justify-between items-end ml-10">
                    <img src="/images/cat1.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Cat1" />
                    <img src="/images/dog2.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Dog2" />
                    <img src="/images/cat2.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Cat2" />
                    <img src="/images/dog1.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto mr-10" alt="Dog1" />
                </div>
            </section>
            <div className="bg-primary-orange w-full rounded-t-3xl h-[calc(100vh-33vh)] flex justify-center items-center">
                <div className="bg-primary-orange-light w-[80%] max-w-[1300px] h-[55vh] p-8 rounded-3xl shadow-lg flex justify-center items-center">
                    <LoginForm/>
                </div>
            </div>
        </>
    );
}