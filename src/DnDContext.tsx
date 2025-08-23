import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction, useContext } from 'react';

type DnDContextType = [string | null, Dispatch<SetStateAction<string | null>>];

const DnDContext = createContext<DnDContextType>([null, () => { }]);

interface DnDProviderProps {
    children: ReactNode;
}

export const DnDProvider = ({ children }: DnDProviderProps) => {
    const [type, setType] = useState<string | null>(null);

    return (
        <DnDContext.Provider value={[type, setType]}>
            {children}
        </DnDContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDnD = () => {
    if (useContext(DnDContext) === undefined) {
        throw new Error('useDnD must be used within a DnDProvider');
    }
    return useContext(DnDContext);
}

export default DnDContext;