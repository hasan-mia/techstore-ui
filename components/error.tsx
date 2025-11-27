import React, { Component } from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle } from 'lucide-react'

export default class Error extends Component {
    render() {
        return (
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to load. Please try again later.
                        </AlertDescription>
                    </Alert>
                </div>
            </section>
        )
    }
}
