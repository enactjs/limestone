import Chips, {Chip} from '../../../../Chips';
import {withConfig} from './utils';

const ChipsTests = [
    <Chips>
        <Chip>Chip 1</Chip>
        <Chip>Chip 2</Chip>
        <Chip>Chip 3</Chip>
    </Chips>,
    <Chips orientation="horizontal">
        <Chip>Chip 1</Chip>
        <Chip>Chip 2</Chip>
        <Chip>Chip 3</Chip>
    </Chips>,
    <Chips>
        <Chip deleteButton>Chip 1</Chip>
        <Chip deleteButton>Chip 2</Chip>
        <Chip deleteButton>Chip 3</Chip>
    </Chips>,
    <Chips>
        <Chip icon="check">Chip 1</Chip>
        <Chip icon="check">Chip 2</Chip>
        <Chip icon="check">Chip 3</Chip>
    </Chips>,
    <Chips>
        <Chip disabled>Chip 1</Chip>
        <Chip disabled>Chip 2</Chip>
        <Chip disabled>Chip 3</Chip>
    </Chips>,

    // When Chips get focus, the focus goes to the Chip
    ...withConfig({focus: true}, [
        <Chips>
            <Chip>Focused Chip 1</Chip>
            <Chip>Chip 2</Chip>
            <Chip>Chip 3</Chip>
        </Chips>,
        <Chips orientation="horizontal">
            <Chip>Focused Chip 1</Chip>
            <Chip>Chip 2</Chip>
            <Chip>Chip 3</Chip>
        </Chips>
    ])
];

export default ChipsTests;