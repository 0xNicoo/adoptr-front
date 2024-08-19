import "../../globals.css"
import LoginForm from "./components/loginForm"

//TODO: Hacerlo responsive

export default function Login() {
    return (
        <>
            <section className="bg-[url('/images/sectionLogin-background.png')] bg-repeat bg-center bg-auto h-[33vh] flex flex-col justify-between ">
                <div className="text-center mt-8">
                    <h1 className="text-4xl font-bold text-primary-blue">
                        Iniciar <span className="text-primary-orange">Sesión</span>
                    </h1>
                </div>
                <div className="flex justify-between items-end ml-10">
                    <img src="/images/cat1.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Cat1" />
                    <img src="/images/dog2.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Dog2" />
                    <img src="/images/cat2.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Cat2" />
                    <img src="/images/dog1.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto mr-10" alt="Dog1" />
                </div>
            </section>
            <div className="bg-primary-orange w-full rounded-t-3xl h-[calc(100vh-35vh)] flex justify-center items-center">
                <div className="bg-primary-orange-light w-[80%] max-w-[1300px] h-[55vh] p-8 rounded-3xl shadow-lg flex justify-center items-center">
                    <LoginForm/>
                </div>
            </div>
        </>
    );
}