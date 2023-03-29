import './loader.scss';

export enum LoaderSizeEnum {
    Small,
    Medium,
    Large
}

interface LoaderProps {
    size: LoaderSizeEnum;
}

export const Loader: React.FC<LoaderProps> = ({ size }) => {
    const classNames = ["loader"];
    switch (size) {
        case LoaderSizeEnum.Small:
            classNames.push("loader--small")
            break;
        case LoaderSizeEnum.Medium:
            classNames.push("loader--medium")
            break;
        case LoaderSizeEnum.Large:
            classNames.push("loader--large")
            break;
    }
    return <div
        className="loader"
    />;
}