import { a } from '@abcdpackage/a';
import { b } from '@abcdpackage/b';
import { c } from '@abcdpackage/c';
import { MaxUint256 } from 'ethers';

export function d(): string {
  return a() + b() + c() + 'd' + MaxUint256;
}