import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const meta: Meta<typeof Carousel> = {
    title: 'UI/Carousel',
    component: Carousel,
};

export default meta;

type Story = StoryObj<typeof Carousel>;

const slides = Array.from({ length: 5 }, (_, i) => `Slide ${i + 1}`);

export const Default: Story = {
    render: () => (
        <Carousel className="w-72">
            <CarouselContent>
                {slides.map((slide) => (
                    <CarouselItem key={slide}>
                        <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-sm">
                            {slide}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div>
                <p className="mb-4 text-sm text-muted-foreground">Horizontal</p>
                <Carousel className="w-72">
                    <CarouselContent>
                        {slides.map((slide) => (
                            <CarouselItem key={slide}>
                                <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-sm">
                                    {slide}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <div>
                <p className="mb-4 text-sm text-muted-foreground">Vertical</p>
                <Carousel orientation="vertical" className="h-64 w-64">
                    <CarouselContent className="-mt-1 h-64">
                        {slides.map((slide) => (
                            <CarouselItem key={slide} className="pt-1">
                                <div className="flex h-full items-center justify-center rounded-lg border bg-muted py-8 text-sm">
                                    {slide}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    ),
};
