import "../../globals.css"
import SignupForm from "./components/signupForm"

//TODO: Hacerlo responsive

export default function Signup() {
    return (
        <>
            <section className="bg-[url('/images/sectionSignup-background.png')] bg-repeat bg-center bg-auto h-[33vh] flex flex-col justify-between ">
                <div className="text-center mt-8">
                    <h1 className="text-4xl font-bold text-primary-blue">
                        Crear <span className="text-primary-orange">Cuenta</span>
                    </h1>
                </div>
                <div className="flex justify-between items-end ml-10">
                    <img src="/images/cat1.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Cat1" />
                    <img src="/images/dog2.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Dog2" />
                    <img src="/images/cat2.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto" alt="Cat2" />
                    <img src="/images/dog1.png" className="w-full max-w-[80px] md:max-w-[130px] h-auto mr-10" alt="Dog1" />
                </div>
            </section>
            <div className="bg-primary-orange w-full rounded-t-3xl h-[calc(100vh-25vh)] flex justify-center items-center">
                <div className="bg-primary-orange-light w-[80%] max-w-[1300px] h-[69vh] p-8 rounded-3xl shadow-lg flex justify-center items-center">
                    <SignupForm/>
                </div>
            </div>
        </>
    );
}