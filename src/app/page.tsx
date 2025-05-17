'use client';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#252526]">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in-down">
                        Καλώς ήρθατε στην πλατφόρμα μάθησης
                    </h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in-down [animation-delay:200ms]">
                        Ανακαλύψτε τα κεφάλαια και ξεκινήστε το ταξίδι σας στην
                        μάθηση
                    </p>

                    <div className="transform transition-all duration-300 hover:scale-105 active:scale-95">
                        <Link
                            href="/chapters"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 inline-block"
                        >
                            Ξεκινήστε τώρα
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    {[
                        {
                            title: 'Διαδραστική Μάθηση',
                            description:
                                'Μάθετε μέσω πρακτικών ασκήσεων και παραδειγμάτων',
                        },
                        {
                            title: 'Προσωπική Πρόοδος',
                            description:
                                'Παρακολουθήστε την πρόοδό σας σε πραγματικό χρόνο',
                        },
                        {
                            title: 'Ευέλικτη Δομή',
                            description:
                                'Μάθετε με τον δικό σας ρυθμό και χρόνο',
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-[#252526] p-6 rounded-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 animate-fade-in-up`}
                            style={{ animationDelay: `${600 + index * 200}ms` }}
                        >
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
