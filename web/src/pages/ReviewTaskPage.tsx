import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Send } from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function ReviewTaskPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock task data - replace with actual data from props/context
  const task = {
    id: taskId || '1',
    title: 'Kitchen Sink Repair',
    description: 'Fixed the kitchen sink drain issue',
    category: 'Plumbing',
    provider: {
      id: 'p1',
      name: 'Marcus Chen',
      specialization: 'Plumbing Expert',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    completedAt: new Date(),
    budget: 85000
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      // await api.post(`/reviews`, { taskId, rating, comment });
      alert('Thank you for your review!');
      navigate('/my-tasks');
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = () => {
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return 'Select a rating';
  };

  return (
    <AppLayout title="Rate & Review" subtitle="Share your experience with the professional">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 0',
            background: 'none',
            border: 'none',
            color: '#F97316',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 24
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Provider Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB', marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>You worked with</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img 
              src={task.provider.avatar} 
              alt={task.provider.name}
              style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', marginBottom: 4 }}>{task.provider.name}</h3>
              <p style={{ fontSize: 13, color: '#6B7280' }}>{task.provider.specialization}</p>
            </div>
          </div>
        </div>

        {/* Task Info Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB', marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>On task</p>
          
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D1B2A', marginBottom: 8 }}>{task.title}</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
            <span>📅</span>
            <span>Completed {task.completedAt.toLocaleDateString()}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280', marginTop: 8 }}>
            <span>💰</span>
            <span>{task.budget.toLocaleString()} XAF</span>
          </div>
        </div>

        {/* Rating Section */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', marginBottom: 20, textAlign: 'center' }}>How would you rate this experience?</h3>
          
          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Star
                  size={48}
                  fill={star <= (hoverRating || rating) ? '#FCD34D' : 'none'}
                  color={star <= (hoverRating || rating) ? '#FCD34D' : '#D1D5DB'}
                  style={{ transition: 'all 0.2s' }}
                />
              </button>
            ))}
          </div>

          {/* Rating Label */}
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F97316', textAlign: 'center' }}>
            {getRatingLabel()}
          </p>
        </div>

        {/* Comment Section */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', marginBottom: 12 }}>Share your feedback</h3>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Tell us more about your experience (optional)</p>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What went well? Any suggestions for improvement?"
            style={{
              width: '100%',
              minHeight: 120,
              border: '1.5px solid #E5E7EB',
              borderRadius: 10,
              padding: '14px',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              color: '#0D1B2A',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />

          {/* Quick Tags */}
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginBottom: 12 }}>Quick tags (click to add):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Professional', 'Punctual', 'Friendly', 'Quality Work', 'Would Recommend'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (comment.includes(tag)) {
                      setComment(comment.replace(tag + ' ', '').replace(tag, ''));
                    } else {
                      setComment(comment + (comment ? ' ' : '') + tag);
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: '1.5px solid #E5E7EB',
                    background: comment.includes(tag) ? '#F97316' : '#fff',
                    color: comment.includes(tag) ? '#fff' : '#6B7280',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '15px',
              background: '#fff',
              color: '#374151',
              border: '1.5px solid #E5E7EB',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={loading || rating === 0}
            style={{
              padding: '15px',
              background: rating === 0 ? '#E5E7EB' : '#F97316',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: rating === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            <Send size={16} /> {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
