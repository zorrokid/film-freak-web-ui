import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearRoute } from "../app/appSlice";
import { AppDispatch, RootState } from "../app/store";

export function useRedirect() {
    const redirect = useSelector((state: RootState) => state.app.redirectRoute);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useEffect(() => {
        if (redirect === undefined) return;
        dispatch(clearRoute());
        navigate(redirect);
    }, [redirect]);
}