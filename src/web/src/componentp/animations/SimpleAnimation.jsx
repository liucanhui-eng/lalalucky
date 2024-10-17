import PagPlayer from '../PagPlayer';
import animationAssets from './assets';

export default function SimpleAnimation({ name }) {

  if (!name || !animationAssets[name]) {
    console.warn(`SimpleAnimation: animation ${name} not found`);
    return null;
  }

  return (
    <PagPlayer src={animationAssets[name]} />
  )
}