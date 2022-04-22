import { convertPropsToObject } from 'src/libs/utils/convert-props-to-object.util';
import { Guard } from '../guard';

export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  public equals(object?: ValueObject<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(object);
  }

  public unpack(): T {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value;
    }

    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (
      Guard.isEmpty(props) ||
      (this.isDomainPrimitive(props) && Guard.isEmpty(props.value))
    ) {
      throw new Error('Property cannot be empty');
    }
  }

  private isDomainPrimitive(
    object: unknown,
  ): object is DomainPrimitive<T & (Primitives | Date)> {
    if (Object.prototype.hasOwnProperty.call(object, 'value')) {
      return true;
    }
    return false;
  }
}
