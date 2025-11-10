import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

interface StrukturLightboxProps {
    open: boolean;
    close: () => void;
    slides: { src: string }[];
}

export default function StrukturLightbox({
    open,
    close,
    slides,
}: StrukturLightboxProps) {
    return (
        <Lightbox
            open={open}
            close={close}
            slides={slides}
            plugins={[Zoom, Fullscreen]}
            styles={{
                container: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                },
            }}
            render={{
                buttonPrev: () => null,
                buttonNext: () => null,
            }}
        />
    );
}
