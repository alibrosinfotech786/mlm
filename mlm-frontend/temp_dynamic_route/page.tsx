"use client";
import ViewProductClient from './ViewProductClient';

export function generateStaticParams() {
  return [];
}

export default function ViewProductPage({ params }: { params: { id: string } }) {
  return <ViewProductClient id={params.id} />;
}

