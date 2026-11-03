import { Compass } from 'lucide-react'
import { ButtonLink } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'

export default function NotFound() {
  return (
    <Card className="mt-6">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for doesn’t exist in this demo."
        action={<ButtonLink to="/dashboard">Return to Dashboard</ButtonLink>}
      />
    </Card>
  )
}
