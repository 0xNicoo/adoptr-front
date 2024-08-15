import "../globals.css"
import SignupForm from "./components/signupForm"


export default function Signup() {
    return (
        <>
            <section className="bg-[url('/images/sectionSignup-background.png')] bg-repeat bg-center bg-auto h-[40vh] flex flex-col justify-between ">
                <div className="text-center mt-8">git 
                    <h1 className="text-4xl font-bold text-primary-blue">
                        Crear <span className="text-primary-orange">Cuenta</span>
                    </h1>
                </div>

                <div className="ml-10 justify-start items-end">
                    <img src="/images/catSignup1.png" style={{ width: '150px', height: 'auto'}} />
                </div>
            </section>
            <div className="bg-primary-orange w-full rounded-t-3xl h-[calc(100vh-20vh)] flex justify-center items-center">
                <div className="bg-primary-orange-light w-[80%] max-w-[1300px] h-[70vh] p-8 rounded-3xl shadow-lg flex justify-center items-center">
                    <SignupForm/>
                </div>
            </div>
        </>
    );
}