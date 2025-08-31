import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileText, Share2, Users, TrendingUp } from 'lucide-react';
import { 
  StatCard, 
  RecentActivityCard, 
  TopPerformingContentCard, 
  UpcomingScheduledCard,
  ActivityItem,
  PerformingContentItem,
  ScheduledItem
} from '@/components/admin/dashboard-components';

describe('Dashboard Components', () => {
  describe('StatCard', () => {
    it('renders with basic props', () => {
      render(
        <StatCard
          title="Test Stat"
          value={100}
          icon={FileText}
        />
      );
      
      expect(screen.getByText('Test Stat')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(
        <StatCard
          title="Test Stat"
          value={100}
          icon={FileText}
          isLoading={true}
        />
      );
      
      expect(screen.getByText('Test Stat')).toBeInTheDocument();
      // Should show skeleton instead of value
      expect(screen.queryByText('100')).not.toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const mockRetry = vi.fn();
      render(
        <StatCard
          title="Test Stat"
          value={100}
          icon={FileText}
          error={new Error('Test error')}
          onRetry={mockRetry}
        />
      );
      
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('displays change percentage', () => {
      render(
        <StatCard
          title="Test Stat"
          value={100}
          change={15.5}
          icon={FileText}
        />
      );
      
      expect(screen.getByText('+15.5% from last period')).toBeInTheDocument();
    });
  });

  describe('RecentActivityCard', () => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'blog',
        title: 'Test Blog Post',
        description: 'Blog post published',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        status: 'published'
      },
      {
        id: '2',
        type: 'social',
        title: 'Test Social Post',
        description: 'Social post published',
        timestamp: new Date('2024-01-15T09:00:00Z'),
        status: 'published',
        platform: 'linkedin'
      }
    ];

    it('renders activity items', () => {
      render(<RecentActivityCard activities={mockActivities} />);
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Test Social Post')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(<RecentActivityCard isLoading={true} />);
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      // Should show skeleton loaders
    });

    it('shows empty state', () => {
      render(<RecentActivityCard activities={[]} />);
      
      expect(screen.getByText('No recent activity found')).toBeInTheDocument();
    });
  });

  describe('TopPerformingContentCard', () => {
    const mockContent: PerformingContentItem[] = [
      {
        id: '1',
        title: 'Top Blog Post',
        type: 'blog',
        metrics: {
          views: 1500,
          likes: 50,
          shares: 25
        }
      },
      {
        id: '2',
        title: 'Top Social Post',
        type: 'social',
        platform: 'linkedin',
        metrics: {
          likes: 100,
          shares: 30,
          comments: 15
        }
      }
    ];

    it('renders content items', () => {
      render(<TopPerformingContentCard content={mockContent} />);
      
      expect(screen.getByText('Top Performing Content')).toBeInTheDocument();
      expect(screen.getByText('Top Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Top Social Post')).toBeInTheDocument();
    });

    it('shows empty state', () => {
      render(<TopPerformingContentCard content={[]} />);
      
      expect(screen.getByText('No performance data available')).toBeInTheDocument();
    });
  });

  describe('UpcomingScheduledCard', () => {
    const mockScheduled: ScheduledItem[] = [
      {
        id: '1',
        title: 'Scheduled Blog Post',
        type: 'blog',
        scheduledAt: new Date('2024-01-16T10:00:00Z')
      },
      {
        id: '2',
        title: 'Scheduled Social Post',
        type: 'social',
        platform: 'twitter',
        scheduledAt: new Date('2024-01-17T14:00:00Z')
      }
    ];

    it('renders scheduled items', () => {
      render(<UpcomingScheduledCard scheduledContent={mockScheduled} />);
      
      expect(screen.getByText('Upcoming Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Scheduled Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Scheduled Social Post')).toBeInTheDocument();
    });

    it('shows empty state with schedule button', () => {
      const mockScheduleNew = vi.fn();
      render(
        <UpcomingScheduledCard 
          scheduledContent={[]} 
          onScheduleNew={mockScheduleNew}
        />
      );
      
      expect(screen.getByText('No scheduled content')).toBeInTheDocument();
      expect(screen.getByText('Schedule Content')).toBeInTheDocument();
    });
  });
});