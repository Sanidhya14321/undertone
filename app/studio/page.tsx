import type { Metadata } from 'next';
import Studio from '../../components/studio/Studio';
import './studio.css';
export const metadata:Metadata={title:'Voice Studio',description:'Your personal Fish Audio voice workspace.',robots:{index:false,follow:false},alternates:{canonical:'/studio'}};
export default function StudioPage(){return <Studio/>;}
