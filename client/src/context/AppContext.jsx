import { createContext } from "react";

 const AppContext= createContext()

 export const AppContextProvider = (props) => {

    const value ={

    }

    return(
        <AppContextProvider value={value}>
            {props.children}
        </AppContextProvider>
    )

}

export default AppContext;