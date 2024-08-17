import Buttons from "./buttons"
import Step1 from "./step-1"
import Stepper from "./stepper"

export default function Poneradopcion() {
    return (
        <div className="bg-background-gray min-h-screen flex pt-2 px-5 pb-2 justify-center">
            <div className="bg-white w-full border border rounded-3xl drop-shadow-md flex flex-col justify-evenly">
            <Stepper/>
            <Step1/>
            <Buttons/>
            </div>
        </div>
    )
}

