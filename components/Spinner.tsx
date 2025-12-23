import { Ring } from "ldrs/react";
import 'ldrs/react/Ring.css';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {


            return (
                <div className={"w-full h-full flex items-center justify-center opacity-60 " + className || ""}>
                    <Ring size={42} stroke={8} color={'white'} />
                </div>
            );
}

export default Spinner;