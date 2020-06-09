import { shuffle, uniq } from "@arkecosystem/utils";

type Props = {
    options: string[];
    value: string;
    limit: number;
}

export function shuffleOptions({ options, value, limit }: Props) {
    const optionsWithoutAnswer = options.filter((item) => item !== value);
    const availableOptions = uniq(shuffle(optionsWithoutAnswer)).slice(0, limit - 1);
    return shuffle([value, ...availableOptions]);
}
